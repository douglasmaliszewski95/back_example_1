import '@supabase/supabase-js'
import { UserRole } from '../enums/user-role-enum';
import { AdminStatus } from '../enums/admin-status-enum';

declare module '@supabase/supabase-js' {
  interface UserMetadata {
    fullname?: string;
    role?: UserRole;
    status?: AdminStatus;
  }
}