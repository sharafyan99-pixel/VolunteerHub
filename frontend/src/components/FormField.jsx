import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";

// A label with an input. Used by the signup and account forms.
//   <FormField label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
export default function FormField({ label, name, value, onChange, type = 'text', required, placeholder, readOnly }) {
  return (
    <div>
      <label>{label}</label>
      <input name={name} value={value ?? ''} onChange={onChange} type={type}
        required={required} placeholder={placeholder} readOnly={readOnly} />
    </div>
  );
}

// Same as FormField, but for passwords: has an eye button to show / hide what you typed.
//   <PasswordField label="Password" name="password" value={form.password} onChange={handleChange} required />
export function PasswordField({ label, name, value, onChange, required, placeholder }) {
  const [visible, setVisible] = useState(false);
  
  return (
    <div>
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <input name={name} value={value ?? ''} onChange={onChange} type={visible ? 'text' : 'password'}
          required={required} placeholder={placeholder} style={{ paddingRight: 42 }} />
        <button type="button" onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'} title={visible ? 'Hide password' : 'Show password'}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none',
            border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}>
          {visible ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}
