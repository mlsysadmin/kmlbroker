import React, { useState,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Resizer from 'react-image-file-resizer';
import "../styles/listing-form.css";

const UploadPhotosComponent = ({ onComplete, setPropertyFields }) => {
	const [uploadedPhotos, setUploadedPhotos] = useState([]);
	const [uploadError, setUploadError] = useState(null);

	const onDrop = (acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			if (validateFile(file)) {
				Resizer.imageFileResizer(
					file,
					800,
					600,
					"JPEG",
					100,
					0,
					(uri) => {
						setUploadedPhotos((prev) => [...prev, { file, preview: uri }]);
					},
					"base64"
				);
				setUploadError(null);
			}
		});
	};

	const validateFile = (file) => {
		const maxFileSize = 15 * 1024 * 1024; // 15 MB
		const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

		if (!allowedTypes.includes(file.type)) {
			setUploadError("Only JPEG, PNG, and GIF files are allowed.");
			return false;
		}

		if (file.size > maxFileSize) {
			setUploadError("File size should not exceed 15 MB.");
			return false;
		}

		return true;
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	useEffect(() => {
    const now = new Date();
    const phtOffset = 8 * 60; 
		const phtDate = new Date(now.getTime() + phtOffset * 60 * 1000);
    const upload_date_time = phtDate.toISOString();
    const complete = uploadedPhotos !== null && uploadedPhotos.length >= 1;
		if (complete) {
      setPropertyFields({
				photos: {
					photo: uploadedPhotos,
					upload_date_time: upload_date_time,
				},
			});
			onComplete(true);
		} else {
			onComplete(false); 
		}
	}, [uploadedPhotos, onComplete]);

	return (
		<div className="uploadPhotos">
			<h1>Upload Photos</h1>
			<center>
				<div className="uploadPhotosContent">
					<ul>
						<li>
							Photos that have watermarks, phone numbers, website URLs, email
							addresses, or in collage format will be removed.
						</li>
						<li>
							Horizontal/landscape images display best and are recommended.
							Vertical/portrait images and panoramic images are accepted but not
							recommended as they do not take full advantage of the space
							provided.
						</li>
						<li>
							We require a minimum of one distinct photo that pertains to the
							actual property being posted. The higher the quality of the
							photos, the better it is for your listing{" "}
							{"(maximum file size of 15 MB per photo)"}. DO NOT duplicate
							photos please.
						</li>
						<li>
							Computer drawings or artist renders for the properties are NOT
							ALLOWED. We do ALLOW floor plans of the property as long as it is
							accompanied with actual photos of the property's interiors and
							facade.
						</li>
					</ul>
					<div {...getRootProps({ className: "dragAndDropPhotoHere" })}>
						<input {...getInputProps()} />
						<p>Drag & drop photos here, or click to select photos</p>
					</div>
					{uploadError && <p className="error">{uploadError}</p>}
					<div className="DisplayUploadedPhotoHere">
						{uploadedPhotos.map((photo, index) => (
							<div key={index} className="image">
								<img
									src={photo.preview}
									alt={`Uploaded preview ${index}`}
									style={{ width: "200px", height: "160px" }}
								/>
							</div>
						))}
					</div>
				</div>
			</center>
		</div>
	);
};

export default UploadPhotosComponent;
