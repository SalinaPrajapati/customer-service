# Technical decisions

1. **Typed service facade** — Chosen to isolate UI from transport. A direct mock import in components was rejected because it makes a backend migration costly.
2. **Feature-local state plus `useAsync`** — Chosen because this flow has no cross-screen server cache requirement. Redux/query libraries were rejected as unnecessary dependency and setup overhead for this scope.
3. **Promise-based stateful mock** — Chosen to model latency, validation, and race-like slot conflicts realistically. Static JSON was rejected because it cannot enforce booking rules.
4. **Domain types shared across layers** — Chosen to make contract drift visible at compile time. Duplicated UI/API interfaces were rejected because they silently diverge.
5. **Server-authoritative booking validation** — Chosen because availability can change after selection. Client-only disabled buttons were rejected; the API still returns a 409 conflict.
6. **Focused behavioral tests** — Chosen to verify user-visible outcomes and business rules. Snapshot-only tests were rejected because they do not prove error or conflict handling.
