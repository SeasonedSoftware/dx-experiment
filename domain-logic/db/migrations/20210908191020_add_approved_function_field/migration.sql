-- AlterTable
CREATE FUNCTION approved (s scenario)
  returns BOOLEAN language 'sql'
  AS $$ SELECT EXISTS (SELECT FROM scenario_approval sa WHERE sa.scenario_id = s.id); $$
