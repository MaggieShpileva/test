---
name: data-layer
description: "Server and client state with TanStack Query, Redux Toolkit, axios, types, and route loaders. Use when adding API calls, queries, mutations, store slices, endpoints, or loaders."
disable-model-invocation: false
---

# Data layer (React Query + RTK + API)

Universal rules for **Vite + React + TypeScript** with **TanStack Query** and/or **Redux Toolkit**.  
Discover the repo first, then copy **existing** modules 1:1 in style.

Related: [react-feature-ui](../react-feature-ui/SKILL.md), [project-conventions](../project-conventions/SKILL.md).

## Discover

| Artifact | Typical paths |
|----------|----------------|
| HTTP client | `src/lib/api/`, `src/api/` |
| Endpoints map | `endpoints.ts` / `API_ENDPOINTS` |
| Query modules | `src/lib/react-query/*.ts` |
| Query keys | `query-keys.ts` / `queryKeys` |
| RTK store | `src/store/`, `store/features/*` |
| Typed hooks | `store/hooks.ts` (`useAppDispatch`, `useAppSelector`) |
| Domain types | `src/types/` |
| Route loaders | `src/loaders/` |

No Query — do not add it “for neatness”. No RTK — do not pull Redux for a single flag.

## Separation of concerns

| Layer | For | Not for |
|-------|-----|---------|
| **TanStack Query** | Server state: fetch, cache, mutation, stale/refetch | Local UI (modal open, hover) |
| **Redux Toolkit** | Client / cross-screen UI state, rarely session flags | Duplicating the entire API cache from Query |
| **Feature** | Orchestrating Query/store hooks + UI | Raw `axios` deep inside UI primitives |
| **UI** | Presentation | `useQuery` / `dispatch` of domain entities (except existing repo exceptions) |
| **types/** | DTO / API schema types | Logic |

## API

1. Paths — in central `API_ENDPOINTS` (or equivalent), not a string in the component.
2. Calls — through shared `apiClient` (interceptors, auth retry — as in the repo).
3. Response/body types — in `src/types/`, `type` + suffixes in repo style (`*Schema`, `*Response`, …).
4. Place new methods next to existing domain api/query modules.

## React Query

- Keys — `queryKeys.*` factory, no ad-hoc arrays in components.
- `useQuery` / `useMutation` — in `lib/react-query/<domain>.ts` (or the accepted place); Feature only consumes hooks.
- After mutation — `invalidateQueries` / targeted `setQueryData`, as in neighboring modules.
- Auth-gated queries: reuse existing `enabled`/token helper, do not invent a second one.

```ts
// pattern (names — from the repo)
export const useThingQuery = (id: string) =>
  useQuery({
    ...getThingQueryOptions(id),
    enabled: Boolean(id) && tokenEnabled,
  });
```

## Redux Toolkit

- Slice per UI domain: `store/features/<name>/<name>Slice.ts`
- Only typed hooks from `store/hooks`
- Do not put data in the store that Query already caches, without a clear reason

## Loaders (React Router)

- Prefetch / required route data — in `loaders/`, if that is the pattern.
- Loader uses the same query options / api as hooks (single source).
- Page stays thin: loader + `<Feature />`.

## Checklist

- [ ] Discover: client, endpoints, queryKeys, store hooks
- [ ] Endpoint in the map, type in `types/`
- [ ] Query/mutation outside UI primitive
- [ ] Keys via factory; cache updated after write
- [ ] RTK only for client state, no Query duplicate
