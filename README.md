# ⭐️ Jispatcher

A modern Asynchronous JavaScript **task dispatcher** that enables
tasks to be **atomic operation** so that protect your data and code logic.

```sh
npm install --save jispatcher
# or
yarn add jispatcher
# or
pnpm add jispatcher
```

# Getting Started

```typescript
import { Disptacher } from "jispatcher";

const dispatcher = new Dispatcher();
function handler(): Promise<number> {
  // entire function that passed
  // to the invoke() will be executed
  // one by one. Only one task is
  // totally executed, the next
  // will be picked.
  return dispatcher.invoke(() => {
    // A series of async transactions¬
  });
}
```

# 🧐 Wait a moment, why we need this library?

Yes, I do of course know that JavaScript is a
single thread language that there is no traditional thread safe problem. But does that really mean complete security?

Considering following situation:
There is an api that used for registering a new user.
After ensured that user name is not duplicated, this api will
firstly do something and then create a new user at last.

The pseudo code are as followings:

```typescript
/**
 * Register a new user.
 * @return Newly registered user's id
 */
async function register(userName: string, password: string): Promise<number> {
  if (await isUserNameOccupied()) {
    throw new Error("User name has been used, please choose another.");
  }
  const user = new User();
  user.name = userName;
  user.password = password;
  const insertedUser = await insertToDB(user);
  return insertedUser.id;
}
```

Nonetheless, above codes is bugged:

If there is more than one register request was received
at almost same time, and both of them carrying same user name.

Assume that there is one task from all got the
promise of isUserNameOccupied resolved, then it will
create user entity and started to await for insertToDB.

When the network operation is processing by external native code.
The event loop will goto take next task executed.

Bug is here: The next task that carrying same user name may not detecting
the user name was occupied, then it will send another insert sql to DB.

At last, we got **two user with same user name**.

Even JavaScript is a thread-safe language, there still maybe some
errors.

So we need a dispatcher to make the function register
as atomic operation. Even one million request received,
**all of them will be handled one by one**, and keep its async features.

# 😎 How to use this?

## Make above example safe:

```typescript
// Got a dispatcher for register transaction.
const dispatcher = new Dispatcher();
/**
 * Register a new user.
 * @return Newly registered user's id
 */
async function register(userName: string, password: string): Promise<number> {
  return dispatcher.invoke(async () => {
    if (await isUserNameOccupied()) {
      throw new Error("User name has been used, please choose another.");
    }

    const user = new User();
    user.name = userName;
    user.password = password;
    const insertedUser = await insertToDB(user);

    return insertedUser.id;
  });
}
```

# 😻 Contribute

All PRs are always welcomed.

```sh
git clone git@github.com:zsh2401/jispatcher.git
pnpm install
```
