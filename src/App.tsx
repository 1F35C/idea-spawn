import React, { useEffect, useState } from 'react';
import './App.css';

interface Tag {
  name: string;
  count: number;
}

type BlacklistedTags = Record<string, boolean>;

interface CheckboxProps {
  tag: Tag;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ tag, checked, onChange }) => (
  <div>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {tag.name} {tag.count}
  </div>
);

interface TagSelectionProps {
  tags: Tag[];
}

const TagSelection: React.FC<TagSelectionProps> = ({ tags }) => {
  const [count, setCount] = useState(1);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [blacklistedTags, setBlacklistedTags] = useState<BlacklistedTags>({});
  const [showBlacklist, setShowBlacklist] = useState(false);

  const handleRandomize = () => {
    const filteredTags = tags.filter((tag: Tag) => !blacklistedTags[tag.name]);

    // Shuffle tagNames array
    for (let i = filteredTags.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredTags[i], filteredTags[j]] = [filteredTags[j], filteredTags[i]];
    }

    const selected = filteredTags.slice(0, count);

    // Sort the tags based on the value of tags prop
    selected.sort((a: Tag, b: Tag) => b.count - a.count);

    setSelectedTags(selected);
  };

  const handleBlacklistChange = (tagName: string) => {
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
          <div key={tag.name}>{tag.name}</div>
        ))}
      </div>
      <button onClick={toggleBlacklist}>Toggle Blacklist</button>
      {showBlacklist &&
        tags.map(tag => (
          <Checkbox
            key={tag.name}
            tag={tag}
            checked={blacklistedTags[tag.name] || false}
            onChange={() => handleBlacklistChange(tag.name)}
          />
        ))}
    </div>
  );
};

function App() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch('/tags.json');
      const jsonData = await response.json();
      setTags(jsonData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (tags === null) {
    return <div>ERROR: Tag information could not be loaded...</div>;

  }
  return (
    <div className="App">
      <TagSelection tags={tags} />
    </div>
  );
}

export default App;