import React from "react";
import { NotificationTypes } from "./config";

type PropsOf<C> = C extends React.ComponentType<infer P> ? P : never;

type ResolverPropsFromMap<M extends Record<string, React.ComponentType<any>>> =
    | ({ type?: "simple"; data: PropsOf<M["simple"]> })
  | {
      [K in Exclude<keyof M, "simple">]: {
        type: K;
        data: PropsOf<M[K]>;
      }
    }[Exclude<keyof M, "simple">];


export function Resolver<
  M extends Record<string, React.ComponentType<any>>
>(map: M) {
  type RP = ResolverPropsFromMap<M>;
  return function NotificationResolver(props: RP) {
    const type = (props as any).type ?? "simple";
    const data = (props as any).data;
    const Comp = (map as any)[type] ?? map.simple;
    return <Comp {...data} />;
  };
}

export const NotificationResolver = Resolver(NotificationTypes);
