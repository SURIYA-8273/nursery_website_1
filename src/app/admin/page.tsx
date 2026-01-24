import { redirect } from 'next/navigation';
import { APP_CONFIG } from '@/core/config/constants';

export default function AdminRootPage() {
    redirect(APP_CONFIG.routes.admin.dashboard);
}
