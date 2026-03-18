import { ArrowUp, ArrowDown } from 'lucide-react';

export const SortableHeader = ({ 
  label, 
  sortKey, 
  currentSort, 
  currentOrder, 
  onSort,
  style = {}
}) => {
  const isActive = currentSort === sortKey;
  
  const handleClick = () => {
    if (isActive) {
      // Toggle order if already sorting by this column
      onSort(sortKey, currentOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Default to ASC when first clicking a new column
      onSort(sortKey, 'ASC');
    }
  };
  
  return (
    <th 
      onClick={handleClick}
      style={{
        ...styles.th,
        ...style,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div style={styles.content}>
        <span>{label}</span>
        <span style={styles.iconContainer}>
          {isActive ? (
            currentOrder === 'ASC' ? (
              <ArrowUp size={14} style={styles.activeIcon} />
            ) : (
              <ArrowDown size={14} style={styles.activeIcon} />
            )
          ) : (
            <ArrowUp size={14} style={styles.inactiveIcon} />
          )}
        </span>
      </div>
    </th>
  );
};

const styles = {
  th: {
    textAlign: 'left',
    padding: '1rem',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    whiteSpace: 'nowrap',
    backgroundColor: '#0a0a0a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    transition: 'color 0.2s ease',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
  },
  activeIcon: {
    color: '#C8922A',
    transition: 'transform 0.2s ease',
  },
  inactiveIcon: {
    color: 'rgba(255,255,255,0.2)',
    transition: 'color 0.2s ease',
  },
};
