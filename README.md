# Campus Café: ordering app

A one-page ordering app for the campus café. Customers browse the menu, build an order, pick a discount and place the order. If something is wrong, they get a clear error.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**.

## How to run

You need **Node.js 20 or newer**.

```bash
npm install        # once, after cloning
npm run dev        # start the app → http://localhost:3000
```

Production build:

```bash
npm run build
npm start          # → http://localhost:3000
```

## How to run the tests

```bash
npm test             # run all unit tests once
npm run test:watch   # re-run tests whenever a file changes
```

The tests live in [`src/domain/__tests__/`](src/domain/__tests__) and cover:
- the discounts
- the totals
- the cart and its observers
- every `placeOrder` error code

Run `npm run lint` to check code style.

## What the page does

| Requirement | Where |
|---|---|
| **Menu** of 9 items, each with a name, price and stock status. Two items are out of stock on purpose. | [`src/domain/menu.ts`](src/domain/menu.ts), [`MenuItemCard.tsx`](src/components/MenuItemCard.tsx) |
| **Cart**: add, remove and change quantity (−/+ or type a number). The total updates by itself. | [`src/domain/cart.ts`](src/domain/cart.ts), [`CartLines.tsx`](src/components/CartLines.tsx), [`CartTotal.tsx`](src/components/CartTotal.tsx) |
| **Discount** choice: None, Student (10%), Staff (15%), Happy Hour (second drink free) | [`src/domain/discounts/`](src/domain/discounts), [`DiscountPicker.tsx`](src/components/DiscountPicker.tsx) |
| **Place order**: a clear error for each problem, or an order number and summary | [`src/domain/placeOrder.ts`](src/domain/placeOrder.ts), [`OrderErrorAlert.tsx`](src/components/OrderErrorAlert.tsx), [`OrderConfirmation.tsx`](src/components/OrderConfirmation.tsx) |

**Happy Hour rule:** all drinks in the cart are lined up from most to least expensive, and every second one is free. In each pair, the cheaper drink is the free one. Food is never discounted.

## Folder structure

```
src/
├── app/                  Next.js route: layout.tsx, page.tsx, globals.css
├── components/           React UI (one component per job)
├── hooks/
│   └── useObservable.ts  connects React components to the Observer subject
└── domain/               plain TypeScript business logic, with no React (easy to test)
    ├── types.ts          MenuItem, CartLine, CartSnapshot, Totals
    ├── menu.ts           the menu data
    ├── money.ts          price formatting (prices are stored in cents)
    ├── observer.ts       generic Observable (subject) base class
    ├── cart.ts           Cart = the observable subject
    ├── pricing.ts        subtotal / discount / total maths
    ├── placeOrder.ts     the placeOrder contract and its implementation
    ├── discounts/        Strategy pattern: one class per discount rule
    ├── __fixtures__/     test data
    └── __tests__/        Jest unit tests
```

## Design patterns

### Strategy: discounts
- Every discount rule implements one interface, [`DiscountStrategy`](src/domain/discounts/DiscountStrategy.ts): `id`, `label`, `description` and `calculateDiscount(lines)`.
- There is one class per rule: [`NoDiscount`](src/domain/discounts/NoDiscount.ts), [`StudentDiscount`](src/domain/discounts/StudentDiscount.ts), [`StaffDiscount`](src/domain/discounts/StaffDiscount.ts) and [`HappyHourDiscount`](src/domain/discounts/HappyHourDiscount.ts).
- Student and Staff share the reusable [`PercentageDiscount`](src/domain/discounts/PercentageDiscount.ts) base class.
- The cart stores the chosen strategy. [`calculateTotals`](src/domain/pricing.ts) calls `calculateDiscount` without knowing which rule it is.

### Observer: cart → total and summary
- [`Observable<T>`](src/domain/observer.ts) is the subject. It has `subscribe(listener)`, which returns an unsubscribe function, and it calls `notify()` on every change.
- [`Cart`](src/domain/cart.ts) extends it. Each change (add, remove, set quantity, set discount, clear) builds a new immutable snapshot and notifies every observer.
- These components are the observers. Each one subscribes through [`useObservable`](src/hooks/useObservable.ts), a thin wrapper around React's `useSyncExternalStore`, and updates by itself:
  - [`CartTotal`](src/components/CartTotal.tsx): subtotal, discount and total.
  - [`CartSummary`](src/components/CartSummary.tsx): the "3 items · €9.40" badge in the header.
  - [`CartLines`](src/components/CartLines.tsx): the cart line list.
  - [`DiscountPicker`](src/components/DiscountPicker.tsx): the selected discount.
  - [`OrderErrorAlert`](src/components/OrderErrorAlert.tsx): hides itself once the cart changes.
- [`CafeApp`](src/components/CafeApp.tsx) creates the cart but does **not** subscribe to it.

## SOLID principles in the code

The code comments mark each principle with `SOLID (S)`, `SOLID (O)` and so on.

| Principle | Where | How |
|---|---|---|
| **S**: Single responsibility | [`cart.ts`](src/domain/cart.ts), [`pricing.ts`](src/domain/pricing.ts), [`placeOrder.ts`](src/domain/placeOrder.ts) | The cart only stores what the customer picked. `pricing.ts` only does the maths. `placeOrder` only validates and creates the order. Each React component has one job. |
| **O**: Open/closed | [`discounts/index.ts`](src/domain/discounts/index.ts), [`DiscountPicker.tsx`](src/components/DiscountPicker.tsx) | To add a discount, write a new class and add it to the `DISCOUNTS` list. Cart, pricing, `placeOrder` and the UI (which renders from the list) don't change. |
| **L**: Liskov substitution | [`DiscountStrategy.ts`](src/domain/discounts/DiscountStrategy.ts) | Any strategy can replace any other. The tests even plug in a made-up one ([`pricing.test.ts`](src/domain/__tests__/pricing.test.ts)). |
| **D**: Dependency inversion | [`pricing.ts`](src/domain/pricing.ts), [`placeOrder.ts`](src/domain/placeOrder.ts) | Pricing depends on the `DiscountStrategy` interface, not on concrete classes. `placeOrder` receives its order-number generator (and clock) as an injectable dependency. |

## Contract: `placeOrder(cart)`

Defined and documented in [`src/domain/placeOrder.ts`](src/domain/placeOrder.ts).

```ts
placeOrder(cart: CartSnapshot, deps?: Partial<PlaceOrderDeps>): PlaceOrderResult
```

**Takes**
- `cart`: the cart's lines (item and quantity) and the chosen discount strategy. This is what `Cart.getSnapshot()` returns.
- `deps`: optional `nextOrderNumber()` / `now()` overrides, used by the tests.

**Returns on success**
- `{ ok: true, order }`, where `order` contains:
  - `orderNumber` (e.g. `"#1001"`)
  - one summary line per item
  - `subtotal`, `discount`, `discountLabel` and `total` (all amounts in cents)
  - `placedAt`

**Returns on failure:** `{ ok: false, error: { code, message, items } }`. The checks run in this order, and the first problem found is returned:

| Code | When | `items` | What the page shows |
|---|---|---|---|
| `EMPTY_CART` | The cart has no lines | `[]` | "Your cart is empty". Add something from the menu. |
| `INVALID_QUANTITY` | A quantity isn't a whole number from 1 to 10 | the offending items | "Please check your quantities", naming the items |
| `OUT_OF_STOCK` | An item in the cart is out of stock | the out-of-stock items | "Something in your cart is out of stock", naming the items |

**Guarantees**
- It never throws for a customer mistake.
- It never changes the cart.
- The result is a TypeScript discriminated union, so callers must check `ok` before reading `order` or `error`.
- The page maps every code in a `Record<OrderErrorCode, …>`, so forgetting to handle a code is a compile error.

## Try it by hand

| Do this | You should see |
|---|---|
| Click **Place order** with an empty cart | `EMPTY_CART` error |
| Add a Caffè Latte, type **11** (or **0**) as its quantity, then place the order | `INVALID_QUANTITY` error naming Caffè Latte |
| Add **Avocado Toast** or **Iced Peach Tea** (out of stock), then place the order | `OUT_OF_STOCK` error naming the item |
| Set a valid quantity and switch between discounts | The total and the header badge update immediately |
| Two lattes + **Happy Hour** | One latte is free (€7.00 → €3.50) |
| Place a valid order | Order number (`#1001`, `#1002`, …) and a summary. The cart empties. |

> Orders aren't saved anywhere (there's no backend), so order numbers start again at `#1001` when the page reloads.

