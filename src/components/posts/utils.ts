import { tagColors } from '@/models';


const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};


function truncateHtml(content, length) {
  const div = document.createElement('div');
  div.innerHTML = content;
  const truncatedText = div.textContent || div.innerText;

  if (truncatedText.length > length) {
    return truncatedText.substring(0, length) + '...';
  }
  return truncatedText;
}


const getRandomColor = () => {
  const colors = [
    'bg-blue-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-teal-200'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getTagColor = (tagName: string) => {
  const normalizedName = tagName.toLowerCase();
  if (tagColors[normalizedName]) {
    return tagColors[normalizedName];
  }
  const colorKeys = Object.keys(tagColors);
  const index = Math.abs(normalizedName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colorKeys.length;
  return tagColors[colorKeys[index]];
};

export { truncateText, truncateHtml, getRandomColor, getTagColor };
