import { LoadingOutlined } from '@ant-design/icons';
// @ts-ignore
import {Spin} from "antd";
import {FC} from "react";

interface LoaderProps{
    tip?:string
    size?:number
}

const Loader: FC<LoaderProps> = ({tip='Loading...',size=100}) =>{
    return(
        <Spin tip={tip} indicator={<LoadingOutlined style={{ fontSize: size ,fontWeight:'bolder'}} spin />} />
    )
};

export default Loader;