-- Seeds a sensible set of default categories for every new user, right after
-- their profile row is created. Run this once in the Supabase SQL editor
-- for projects that already ran 0001_init.sql.

create function public.seed_default_categories()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.categories (user_id, name, kind, color, icon) values
    (new.id, 'Salário', 'income', '#22c55e', 'wallet'),
    (new.id, 'Freelance', 'income', '#16a34a', 'briefcase'),
    (new.id, 'Outras receitas', 'income', '#4ade80', 'plus-circle'),
    (new.id, 'Moradia', 'expense', '#ef4444', 'home'),
    (new.id, 'Alimentação', 'expense', '#f97316', 'utensils'),
    (new.id, 'Transporte', 'expense', '#eab308', 'car'),
    (new.id, 'Saúde', 'expense', '#06b6d4', 'heart-pulse'),
    (new.id, 'Educação', 'expense', '#3b82f6', 'graduation-cap'),
    (new.id, 'Lazer', 'expense', '#a855f7', 'popcorn'),
    (new.id, 'Assinaturas', 'expense', '#ec4899', 'repeat'),
    (new.id, 'Outras despesas', 'expense', '#6b7280', 'more-horizontal')
  on conflict (user_id, name, kind) do nothing;
  return new;
end;
$$;

create trigger on_profile_created_seed_categories
  after insert on public.profiles
  for each row execute procedure public.seed_default_categories();
