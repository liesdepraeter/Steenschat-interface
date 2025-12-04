import './IconCamera.css'

type Class = string;

interface CameraProps {
  classname?: Class; 
}

const IconCamera: React.FC<CameraProps> = ({ classname }) => {
  return (
    <div className={classname? `${classname}` : 'icon-size'}>
        {/*<img src="/icons/video.svg" alt="camera" width={32} />*/}
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.6667 9.33337L21.3333 16L30.6667 22.6667V9.33337Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.6667 6.66663H3.99999C2.52724 6.66663 1.33333 7.86053 1.33333 9.33329V22.6666C1.33333 24.1394 2.52724 25.3333 3.99999 25.3333H18.6667C20.1394 25.3333 21.3333 24.1394 21.3333 22.6666V9.33329C21.3333 7.86053 20.1394 6.66663 18.6667 6.66663Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
  )
}

export default IconCamera

{/*width="32" height="32"*/}