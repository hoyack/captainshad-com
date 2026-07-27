# Incident Starter Kit

A copy-ready starting point for small teams keeping a live service running.

## First 15 minutes

### Minute 0–5: stabilize
- [ ] Name one incident lead.
- [ ] Open a timestamped incident log.
- [ ] Write the user-visible symptom in one sentence.
- [ ] Stop unrelated deployments and risky changes.
- [ ] Pick an initial severity and next update time.

### Minute 5–10: bound the problem
- [ ] Check the primary user journey from outside the system.
- [ ] Compare the last known-good state to recent changes.
- [ ] Check dependencies, certificates, DNS, capacity, queues, and error rates.
- [ ] Decide whether the safest move is rollback, failover, feature disable, or observation.

### Minute 10–15: communicate and act
- [ ] Assign an action owner and a separate communications owner.
- [ ] Post what is known, what is not known, current impact, and next update time.
- [ ] Make one reversible change at a time and record the result.
- [ ] Define the recovery checks before declaring recovery.

## Incident log

```text
Incident:
Started (UTC):
Incident lead:
Severity:
User impact:
Last known good:
Recent changes:

TIME (UTC) | OBSERVATION / ACTION | OWNER | RESULT
-----------|----------------------|-------|-------
           |                      |       |

Next update:
Recovery checks:
```

## Status update

```text
We are investigating [user-visible symptom] affecting [scope].
Current impact: [what users can/cannot do].
Known: [facts only].
Unknown: [open questions].
Action underway: [current step].
Next update by: [time and timezone].
```

## Recovery gate

- [ ] The primary user journey succeeds from outside the system.
- [ ] Error rate, latency, queues, and capacity are stable for an agreed observation window.
- [ ] Data integrity checks pass.
- [ ] Monitoring is active and the incident lead approves closure.
- [ ] Follow-up owner and postmortem date are recorded.

Source: Small Crew Runbooks, published by Hoyack. Adapt this template to the service; it is not a substitute for service-specific engineering or security review.
