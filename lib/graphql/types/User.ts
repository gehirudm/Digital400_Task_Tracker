import { builder } from "../builder";

export const UserType = builder.objectRef<{
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}>("User");

UserType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    name: t.exposeString("name", { nullable: true }),
    avatarUrl: t.exposeString("avatarUrl", { nullable: true }),
    createdAt: t.field({
      type: "DateTime",
      resolve: (user) => user.createdAt as Date,
    }),
    updatedAt: t.field({
      type: "DateTime",
      resolve: (user) => user.updatedAt as Date,
    }),
  }),
});
