import React from 'react';
import ImgPart from './imgPart/imgPart';
const Footer=(props)=>{
    const { className, style } = props;// 对传入的props进行合理的默认值设置和校验
    return(
        <div className={`header ${className}`} style={style}  >
            <ImgPart/>
        </div>
    )
}
export default Footer;