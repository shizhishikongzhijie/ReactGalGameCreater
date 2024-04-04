import React, { useState, useCallback } from 'react';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';

const Header = (props) => {
    const { className, style } = props;// 对传入的props进行合理的默认值设置和校验
    const [playstate, setPlayState] = useState(false); // 将字符串 'false' 改为布尔值 false
    // 使用useCallback优化性能
    const handleClick = useCallback(() => setPlayState(prevState => !prevState), [setPlayState]);

    // 根据 playstate 渲染不同的图标
    const renderIcon = () =>
        playstate ? <PauseCircleFilled style={{ fontSize: '40px', color: 'rgb(163,168,255)' }} />
            : <PlayCircleFilled style={{ fontSize: '40px', color: 'rgb(103,168,255)' }} />;

    return (
        <div className={`header ${className}`} style={style}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    border: "4px solid rgb(68,73,167)",
                    borderRadius: "100%",
                    cursor: "pointer", // 添加光标样式以指示元素是可点击的
                }}
                onClick={handleClick} // 在这里处理点击事件
                aria-label={playstate ? 'Pause' : 'Play'} // 使用aria-label提供有意义的标签
                role="button" // 指定元素的角色为按钮
            >
                {renderIcon()}
            </div>
        </div>
    );
}

export default Header;
