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

export type OccurrenceType = "furto" | "roubo" | "outro";

export interface Occurrence {
  id: string;
  user_id: string;
  type: OccurrenceType;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  occurred_at: string;
  photo_url: string | null;
  created_at: string;
}

export type SellerStatus = "pending" | "approved" | "suspended";
export type ProductStatus = "draft" | "active" | "inactive";
export type OrderStatus = "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled";
export type PaymentProvider = "mercado_pago" | "stripe" | "pix";
export type DiscountType = "percent" | "fixed";

export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  status: SellerStatus;
  created_at: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  status: ProductStatus;
  created_at: string;
  sellers?: Pick<Seller, "id" | "store_name" | "slug"> | null;
  product_categories?: Pick<MarketplaceCategory, "id" | "name" | "slug"> | null;
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  position: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product | null;
}

export interface Coupon {
  id: string;
  seller_id: string | null;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  coupon_id: string | null;
  shipping_address: ShippingAddress;
  payment_provider: PaymentProvider | null;
  payment_status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  seller_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  orders?: Pick<Order, "id" | "status" | "created_at"> | null;
}
