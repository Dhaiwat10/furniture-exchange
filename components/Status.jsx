import React from 'react';
import { Button } from '@supabase/ui';

export const Active = () => (
  <Button size="medium" disabled={true}>
    OPEN
  </Button>
);

export const InActive = () => (
  <Button size="medium" danger={true} disabled={true}>
    CLOSED
  </Button>
);
