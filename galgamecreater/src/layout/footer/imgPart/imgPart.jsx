import React, { useEffect, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import axios from 'axios';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const postfile= (newData)=> {
    axios.post('http://localhost:3300/file', newData)
        .then(function (response) {
            console.log(JSON.parse(newData));
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}
const ImgPart = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [data, setData] = useState({});
    useEffect(() => {
        getFile();
    }, [])
    const  getFile= async ()=> {
    await   axios.get('http://localhost:3300/file')
            .then(function (response) {
                const data = JSON.parse(response.data);
                imgMap(data);
                setData(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleRemove = async (file) => {
        let uidKey = file.uid;
        const newData = data;
        delete newData.backgroundimg[uidKey];
        console.log(newData);
        postfile(newData);
    };
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    const imgMap = (response) => {
        try {
            console.log(' handleChange ' + response);
            console.log(' handleChange ' + response.backgroundimg);
            const backgroundImages = response.backgroundimg;
            for (var Key in response) {
                console.log(Key + ':' + response[Key]);
            }
            // 将backgroundImages对象转换为与fileList相同格式的数组
            const formattedBackgroundImages = Object.entries(backgroundImages).map(([key, value]) => ({
                uid: key, // 使用键作为uid，例如"bg1"
                name: key, // 假设图片扩展名为.jpg
                status: 'done',
                url: value,
            }));
            console.log(formattedBackgroundImages);
            // 合并现有fileList和formattedBackgroundImages
            setFileList([...fileList, ...formattedBackgroundImages]);
        } catch (error) {
            console.error('Error fetching background images:', error);
        }
    }
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    return (
        <>
            <Upload
                accept='image/*'
                method='post'
                name='image'
                action="http://localhost:3300/img"
                multiple={true}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={handleRemove}
                onChange={handleChange}
            >
                {fileList.length >= 1000 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
export default ImgPart;