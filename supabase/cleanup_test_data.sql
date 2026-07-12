-- One-off cleanup: removes the two test occurrences created while verifying
-- the Arhus report flow. Safe to delete this file after running it once.
delete from occurrences
where id in (
  '1170c192-6333-4ff9-a401-d371c90f4af7',
  '399a38ab-124d-4e4d-a2f4-b60d0a6ec0e3'
);
