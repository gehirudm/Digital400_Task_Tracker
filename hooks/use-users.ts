import { useMutation, useQuery } from "@apollo/client/react";

import {
  ME_QUERY,
  UPDATE_USER,
  USERS_QUERY,
} from "@/lib/graphql/operations/users";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface MeQueryData {
  me: UserData | null;
}

interface UsersQueryData {
  users: UserData[];
}

export function useMe() {
  return useQuery<MeQueryData>(ME_QUERY);
}

export function useUsers() {
  return useQuery<UsersQueryData>(USERS_QUERY);
}

export function useUpdateUser() {
  return useMutation<
    { updateUser: UserData },
    { input: { name?: string; avatarUrl?: string } }
  >(UPDATE_USER, {
    update(cache, { data }) {
      const updated = data?.updateUser;
      if (!updated) return;

      const existing = cache.readQuery<MeQueryData>({ query: ME_QUERY });
      if (existing?.me) {
        cache.writeQuery<MeQueryData>({
          query: ME_QUERY,
          data: { me: { ...existing.me, ...updated } },
        });
      }
    },
  });
}
