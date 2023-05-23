import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

type Tag = string;
type Tags = Record<Tag, number>;
type BlacklistedTags = Record<Tag, boolean>;

interface CheckboxProps {
  tag: Tag;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ tag, checked, onChange }) => (
  <div>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {tag}
  </div>
);

interface TagSelectionProps {
  tags: Tags;
}

const TagSelection: React.FC<TagSelectionProps> = ({ tags }) => {
  const [count, setCount] = useState(1);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [blacklistedTags, setBlacklistedTags] = useState<BlacklistedTags>({});
  const [showBlacklist, setShowBlacklist] = useState(false);

  const handleRandomize = () => {
    const tagNames = Object.keys(tags).filter(tagName => !blacklistedTags[tagName]);

    // Shuffle tagNames array
    for (let i = tagNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tagNames[i], tagNames[j]] = [tagNames[j], tagNames[i]];
    }

    const selected = tagNames.slice(0, count);

    // Sort the tags based on the value of tags prop
    selected.sort((a, b) => tags[b] - tags[a]);

    setSelectedTags(selected);
  };

  const handleBlacklistChange = (tagName: Tag) => {
    setBlacklistedTags(prevState => ({ ...prevState, [tagName]: !prevState[tagName] }));
  };

  const toggleBlacklist = () => {
    setShowBlacklist(prev => !prev);
  };

  return (
    <div>
      <button onClick={() => setCount(prev => Math.max(1, prev - 1))}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={handleRandomize}>Randomize</button>
      <div>
        {selectedTags.map(tag => (
          <div key={tag}>{tag}</div>
        ))}
      </div>
      <button onClick={toggleBlacklist}>Toggle Blacklist</button>
      {showBlacklist &&
        Object.keys(tags).map(tagName => (
          <Checkbox
            key={tagName}
            tag={tagName}
            checked={blacklistedTags[tagName] || false}
            onChange={() => handleBlacklistChange(tagName)}
          />
        ))}
    </div>
  );
};

function App() {
  const tags: Tags =  {
    'a': 1,
    'b': 2,
    'c': 3
  }
  return (
    <div className="App">
      <TagSelection tags={tags} />
    </div>
  );
}

export default App;