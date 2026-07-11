export type AccountType =
  | "checking"
  | "savings"
  | "credit_card"
  | "cash"
  | "investment";

export type CategoryKind = "income" | "expense";

export type TransactionType = "income" | "expense" | "transfer";

export type RecurrenceFrequency = "weekly" | "monthly" | "yearly";

export interface Profile {
  id: string;
  full_name: string | null;
  currency: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  institution: string | null;
  color: string;
  initial_balance: number;
  archived: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  kind: CategoryKind;
  color: string;
  icon: string;
  created_at: string;
}

export interface RecurringRule {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  description: string;
  amount: number;
  type: "income" | "expense";
  frequency: RecurrenceFrequency;
  day_of_month: number | null;
  start_date: string;
  end_date: string | null;
  next_run_date: string;
  active: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  recurring_rule_id: string | null;
  transfer_pair_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  occurred_on: string;
  created_at: string;
  // Joined relations (present when selected with a foreign-table select)
  accounts?: Pick<Account, "id" | "name" | "color"> | null;
  categories?: Pick<Category, "id" | "name" | "color" | "icon"> | null;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string;
  amount: number;
  created_at: string;
  categories?: Pick<Category, "id" | "name" | "color" | "icon"> | null;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  color: string;
  archived: boolean;
  created_at: string;
}

export interface GoalContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  note: string | null;
  occurred_on: string;
  created_at: string;
}
