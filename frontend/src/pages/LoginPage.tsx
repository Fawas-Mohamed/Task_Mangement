import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, LoginFormValues } from '../utils/schemas/loginSchema';
import { Input, FieldWrapper } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@test.com', password: '123456' },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate('/', { replace: true });
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message ?? 'Could not sign in. Check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-[14px] font-bold text-white">
            T
          </div>
          <div>
            <h1 className="font-display text-[19px] font-bold tracking-tight text-ink">Welcome back</h1>
            <p className="mt-1 text-[13px] text-ink-soft">Sign in to keep your tasks moving.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex flex-col gap-4">
            <FieldWrapper label="Email" error={errors.email?.message} htmlFor="email">
              <Input id="email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
            </FieldWrapper>

            <FieldWrapper label="Password" error={errors.password?.message} htmlFor="password">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />
            </FieldWrapper>

            <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-[12px] text-ink-faint">
          Demo credentials are pre-filled — just hit sign in.
        </p>
      </motion.div>
    </div>
  );
}
