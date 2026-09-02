import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes } from 'react';

const classes = (...values: Array<string | undefined | false>) => values.filter(Boolean).join(' ');

/** Source-owned shadcn-style primitives keep the visual system portable and easy to tailor. */
export const Button = ({ className, variant = 'default', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' }) => <button className={classes('button', `button--${variant}`, className)} {...props} />;
export const Card = ({ className, ...props }: HTMLAttributes<HTMLElement>) => <article className={classes('card', className)} {...props} />;
export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => <span className={classes('badge', className)} {...props} />;
export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => <input className={classes('input', className)} {...props} />;
