import React, {FC, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import {Container, Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import MemeDisplay from "./MemeDisplay";
import md5 from 'js-md5';
import {useDispatch, useSelector} from "react-redux";
import {droppedMeme} from "../events/VisualAssetEvents";
import {selectMotivationAssetState} from "../reducers";
import {LocalMotivationAsset, MotivationAssetState} from "../reducers/MotivationAssetReducer";
import {makeStyles} from "@material-ui/core/styles";
import {values} from 'lodash';
import {StringDictionary} from "../types/SupportTypes";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'var(--info-color)',
  borderStyle: 'dashed',
  backgroundColor: 'var(--code-block-color)',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const _arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const readFile = (next: File): Promise<{ binaryStr: string; result: ArrayBuffer }> =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as ArrayBuffer;
      const binaryStr = _arrayBufferToBase64(result)
      resolve({binaryStr, result})
    }
    reader.readAsArrayBuffer(next)
  });

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export function getFileType(next: File): string {
  return next.name.substr(next.name.lastIndexOf('.') + 1);
}


function getImageHref(next: File, binaryStr: string) {
  return `data:image/${(getFileType(next))};base64,${binaryStr}`;
}

const Upload: FC = () => {
  const dispatch = useDispatch();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    values(acceptedFiles.reduce((accum, next) => ({
      ...accum,
      [next.name]: next
    }), {} as StringDictionary<File>))
      .reduce((accum, next) =>
        accum.then((others) =>
          readFile(next)
            .then(({
                     binaryStr, result
                   }) => {
              const imageChecksum = md5(result);
              return ([
                ...others,
                {
                  imageFile: next,
                  imageChecksum,
                  imageHref: getImageHref(next, binaryStr),
                  visuals: {
                    id: imageChecksum,
                    path: `${next.name}`,
                    alt: '',
                    cat: [],
                    char: [],
                  },
                } as LocalMotivationAsset
              ])
            })), Promise.resolve<LocalMotivationAsset[]>([]))
      .then(readMeme => {
        dispatch(droppedMeme(readMeme));
      });
  }, [dispatch])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({onDrop, accept: 'image/*'});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const {assets}: MotivationAssetState = useSelector(selectMotivationAssetState);

  const motivationAssetsToUpload = useMemo(() =>
      values(assets).filter(asset => !!asset.imageChecksum)
    , [assets])

  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <section className="container" style={{'cursor': "pointer"}}>
        {/*// @ts-ignore*/}
        <div {...getRootProps({style})}>
          <input {...getInputProps()} />
          <p>Drag/drop some memes here, or click to select some memes</p>
        </div>
        <aside style={{margin: '2rem 0 0 0'}}>
          <Grid container spacing={3}>
            {
              motivationAssetsToUpload.map(motivationAssetToUpload => (
                <Grid item key={motivationAssetToUpload.imageFile?.name} xs={6}>
                  <Link style={{textDecoration: 'none', color: 'inherit'}}
                        to={`/assets/view/upload/${motivationAssetToUpload.imageChecksum}`}>
                    <MemeDisplay href={motivationAssetToUpload.imageHref}/>
                  </Link>
                </Grid>
              ))
            }
          </Grid>
        </aside>
      </section>
    </Container>
  )
};

export default Upload;
