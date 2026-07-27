import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../../../library/components/button';
import { TextInput } from '../../../../../library/components/textinput';
import { useCalendarState } from '../hooks/useCalendarState';

export function CreateCategoryScreen() {
  const navigate = useNavigate();
  const { addCategory } = useCalendarState();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleSave = () => {
    if (!name.trim()) return;
    addCategory({ name: name.trim(), color });
    navigate('/calendar');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <h1 className="lib-h2">Create Calendar Category</h1>
      <p>Add a new category for your calendar events.</p>
      <div className="lib-stack" style={{ gap: 'var(--space-4)' }}>
        <TextInput
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Work"
          autoFocus
        />
        <label className="label" htmlFor="category-color">Color</label>
        <input
          id="category-color"
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
        />
        <div className="lib-flex lib-justify-end" style={{ gap: 'var(--space-3)' }}>
          <Button variant="secondary" onClick={() => navigate('/calendar')}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>Save Category</Button>
        </div>
      </div>
    </div>
  );
}
