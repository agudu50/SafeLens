const variants = {
  primary: 'button button-primary',
  secondary: 'button button-secondary',
  ghost: 'button button-ghost',
}

export default function Button({ children, variant = 'primary', className = '', as: Component = 'button', ...props }) {
  return (
    <Component className={`${variants[variant] || variants.primary} ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}
