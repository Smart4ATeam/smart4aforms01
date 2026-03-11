

## Plan: Increase Form Width

The boss feels the current form width (`max-w-3xl` = 768px) is too narrow and text feels cramped.

### Change

Update the default `maxWidth` in `FormPageTemplate.tsx` from `max-w-3xl` to `max-w-4xl` (896px).

This is a single-line change on line 78 of `src/components/form/FormPageTemplate.tsx`:

```
maxWidth = 'max-w-3xl'  →  maxWidth = 'max-w-4xl'
```

This will apply globally to all form pages since none override the default. If `max-w-4xl` still feels narrow, we can go to `max-w-5xl` (1024px) instead.

