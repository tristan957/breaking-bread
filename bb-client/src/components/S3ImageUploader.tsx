import AWS from "aws-sdk";
import Axios from "axios";
import uuid from "node-uuid";
import React, { Component } from "react";
import { Button, CustomInput } from "reactstrap";

type SignedRequestData = {
	requestUrl: string;
	imageUrl: string;
};

interface IS3ImageUploaderState {
	images: FileList | null;
	imageUrls: string[];
	label: string;
}

interface IS3ImageUploaderProps {
	folderName: string | null;
}

class S3ImageUploader extends Component<IS3ImageUploaderProps, IS3ImageUploaderState> {
	constructor(props: IS3ImageUploaderProps) {
		super(props);
		this.state = {
			images: null,
			imageUrls: [],
			label: "",
		};
	}

	public s3Sign(file: File): SignedRequestData {
		const REGION = "us-east-2";
		let returnData: SignedRequestData = {
			requestUrl: "",
			imageUrl: "",
		};
		let fileName: string = uuid.v4().replace(/-/g, "");
		fileName = `${this.props.folderName ? `${this.props.folderName}/` : ""}${fileName}`;

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

		const signedRequest = s3bucket.getSignedUrl("putObject", s3Params);

		returnData = {
			requestUrl: signedRequest,
			imageUrl: `https://s3.${REGION}.amazonaws.com/${bucketName}/${fileName}`,
		};

		return returnData;
	}

	public fileOnChange = (pics: FileList | null) => {
		this.setState({ images: pics });
		if (pics !== null) {
			this.updateLabel(pics[0].name);
		} else {
			this.updateLabel("No file selected");
		}
	}

	public uploadPicture(file: File): void {
		if (file) {
			if (file.size > 2200000) { // TODO: Only accept specific file types
				alert("Image is too big! Image must me 2 mb at max!");
			} else {
				const result: SignedRequestData = this.s3Sign(file);

				if (result.requestUrl.length > 0) {
					Axios.put(result.requestUrl, file);
					this.state.imageUrls.push(result.imageUrl);
					alert("success");
					console.log(this.state.imageUrls);
				}
			}
		} else {
			alert("File was null!");
		}
	}

	public updateLabel = (s: string): void => {
		this.setState({
			label: s,
		});
	}

	public submit = (e: React.MouseEvent): void => {
		if (this.state.images) {
			Array.from(this.state.images).forEach(pic => { this.uploadPicture(pic); });
		} else {
			alert("no image is uploaded");
		}
	}

	public render(): JSX.Element {
		return (
			<div>
				<CustomInput
					type="file"
					label={this.state.label}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.fileOnChange(e.target.files)} />
				<Button onClick={this.submit}>upload</Button>
				{/* TODO: call submit function */}
			</div>
		);
	}
}

export default S3ImageUploader;
