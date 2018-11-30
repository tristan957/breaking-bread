import AWS from "aws-sdk";
import axios from "axios";
import uuid from "node-uuid";
import React, { Component } from "react";
import { Button, CustomInput } from "reactstrap";

type SignedRequestData = {
  requestUrl: string,
  imageUrl: string,
}

interface IS3ImageUploaderState {
  images: FileList | null,
  imageUrls: string[],
}

interface IS3ImageUploaderProps {
  folderName: string | null,
}

class S3ImageUploader extends Component<IS3ImageUploaderProps, IS3ImageUploaderState> {
  constructor(props: IS3ImageUploaderProps) {
    super(props);
    this.state = {
      images: null,
      imageUrls: [],
    }
    this.fileOnChange = this.fileOnChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  public s3Sign(file: File): SignedRequestData {
    const REGION = "us-east-2";
    let returnData: SignedRequestData = {
      requestUrl: "",
      imageUrl: ""
    };
    let fileName: string;

    if (file.type == "image/png") {
      fileName = uuid.v4().replace(/-/g, '') + uuid.v4().replace(/-/g, '') + '.png';
    }
    else if (file.type == "image/jpeg") {
      fileName = uuid.v4().replace(/-/g, '') + uuid.v4().replace(/-/g, '') + '.jpg';
    }
    else if (file.type == "image/jpg") {
      fileName = uuid.v4().replace(/-/g, '') + uuid.v4().replace(/-/g, '') + '.jpg';
    }
    else {
      alert("image type is not supported");
      return returnData;
    }

    fileName = `${this.props.folderName ? this.props.folderName + "/" : ""}${fileName}`;

    AWS.config.region = REGION;
    AWS.config.accessKeyId = "AKIAIAB7UILT27OPJ5TQ";
    AWS.config.secretAccessKey = "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";

    const bucketName = "bb-imagestore";
    const s3bucket = new AWS.S3();

    const s3Params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60, // expire after 60 mins
      ContentType: file.type,
      ACL: "public-read",
    };

    const signedRequest = s3bucket.getSignedUrl('putObject', s3Params);

    returnData = {
      requestUrl: signedRequest,
      imageUrl: `https://s3.${REGION}.amazonaws.com/${bucketName}/${fileName}`,
    };

    return returnData;
  }

  fileOnChange(pics: FileList | null) {
    this.setState({ images: pics });
  }

  uploadPicture(file: File) {
    if (file) {
      if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
        if (file.size > 2200000) {
          alert("Image is too big! Image must me 2 mb at max!");
        } else {
          let result: SignedRequestData = this.s3Sign(file);

          if (result.requestUrl.length > 0) {
            axios.put(result.requestUrl, file);
            this.state.imageUrls.push(result.imageUrl);
            alert("success");
            console.log(this.state.imageUrls);
          }
        }
      } else {
        alert("Wrong file type! file type must be png, jpg or jpeg!");
      }
    } else {
      alert("File was null!");
    }
  }

  submit(e: any) {
    if (this.state.images) {
      Array.from(this.state.images).forEach(pic => { this.uploadPicture(pic) });
    }
    else {
      alert("no image is uploaded");
    }
  }

  render() {
    return (
      <div>
        <CustomInput
          type="file"
          onChange={(e: any) => this.fileOnChange(e.target.files)} />
        <Button onClick={this.submit}>upload</Button>
      </div>
    );
  }
}

export default S3ImageUploader;
