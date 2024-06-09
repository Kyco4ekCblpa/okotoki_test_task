import React, { useState } from "react";

import "./virtualScroll.css";
import StarIcon from "../StarIcon/StarIcon";

const VirtualScroll = React.forwardRef(({ coins, itemHeight, visibleRows, renderedRows, onFavoriteChange }, ref) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const onScroll = (e) => {
        const newScrollPosition = Math.floor(e.target.scrollTop / itemHeight) * itemHeight;
        setScrollPosition(newScrollPosition);
    };

    const startIndex = Math.floor(scrollPosition / itemHeight);
    const endIndex = Math.min(startIndex + renderedRows, coins.length);

    const items = coins.slice(startIndex, endIndex).map((item, i) => (
        <div
            className="virtual-scroll-item"
            tabIndex={0}
            key={startIndex + i}
            style={{ height: itemHeight }}>

            <StarIcon
                dataId={item}
                onFavoriteChange={onFavoriteChange}
            />

            {item}
        </div>
    ));

    const spacerTopHeight = startIndex * itemHeight;
    const spacerBottomHeight = (coins.length - endIndex) * itemHeight;

    return (
        <div
            ref={ref}
            className="virtual-scroll-container"
            onScroll={onScroll}
            style={{ overflow: 'auto'}}
            >

            <div style={{ height: spacerTopHeight }} />
            {items}
            <div style={{ height: spacerBottomHeight }} />
        </div>
    );
});

export default VirtualScroll;