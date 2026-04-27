# AGENTS

This file defines project guidance for the pressure-network experiments in this repository.

## Additional Local Guidance

- If `.personal/AGENTS.md` exists, read it as additional local guidance before making changes.
- Treat `.personal/AGENTS.md` as local-only unless the user explicitly asks to promote its contents into committed project rules.
- Broader guidance may exist at `C:\dev\ai\gpt\AGENTS.md`; use it when working from the Windows-side project tree.

## Project Guidance

- Keep the saved `v0.0.1` branch as the baseline for the earlier wave-routing prototype.
- Current development may be destructive on the working branch unless the user asks for another checkpoint first.
- Keep the project focused on meaning-first pressure-network experiments:
  - structural signal identity through source nodes and topology
  - local pressure, resistance, threshold, and co-activation learning
  - no explicit signal type, accepted signal type, path history, or backprop-like route credit unless the user reintroduces it
- Prefer small, testable milestones over broad rewrites.
- Update `README.md` and tests when changing the conceptual model.

## Language and Documentation

- Internal technical docs may be in English.
- User-facing docs should prefer Brazilian Portuguese (`pt-BR`) when they become public-facing or polished.
- Keep conceptual docs concise and avoid overstating the maturity of the experiment.

## Runtime and Tooling

- Prefer native/local commands when already installed and safe.
- If a needed tool is not installed locally, prefer running it through Docker from the Windows side when practical.
- Docker can freeze this computer, so do not run open-ended Docker commands casually.

## Docker Failsafe Rules

When Docker is needed, use a bounded wrapper pattern:

- Ask before running Docker.
- Prefer `docker run --rm` over detached containers.
- Add a timeout around the Docker command.
- Add conservative resource limits such as memory and CPU caps when possible.
- Avoid bind-mounting broad directories; mount only the project path needed.
- Avoid long-running watchers inside Docker unless the user explicitly asks.
- After a failed or interrupted Docker run, check for leftover containers before trying again.

Recommended shape from Windows/PowerShell:

```powershell
$job = Start-Job { docker run --rm --memory 1g --cpus 1 -v "${PWD}:/work" -w /work node:22 npm test }
Wait-Job $job -Timeout 60
if ($job.State -eq "Running") { Stop-Job $job }
Receive-Job $job
Remove-Job $job
```

Equivalent shape from shells with `timeout`:

```bash
timeout 60s docker run --rm --memory 1g --cpus 1 -v "$PWD:/work" -w /work node:22 npm test
```

If Docker appears stuck or the machine becomes unstable, stop and report the situation instead of retrying repeatedly.

## Git

- Use semantic commit messages when committing.
- Do not overwrite or revert user changes unless explicitly asked.
- Before major conceptual shifts, offer or create a branch/checkpoint when appropriate.
