import { IUser, User } from "../models/user.model";

async function createUser(user: IUser) {
  const existstingUser = await User.findByUsername(user.username);
  if (existstingUser !== null) {
    console.log(`User ${user.username} already exists`);
    return;
  }
  const newUser = await User.create(user);
  await newUser.save();
  console.log(`User ${user.username} created`);
}

export async function seedUsers() {
  const users: IUser[] = [
    {
      username: "admin",
      password: "admin",
      isAdmin: true,
    },
    {
      username: "user",
      password: "user",
      isAdmin: false,
    },
  ];
  for (const user of users) {
    await createUser(user);
  }
}
