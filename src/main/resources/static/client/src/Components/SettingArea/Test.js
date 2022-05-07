

import React from 'react';
import $ from 'jquery';

export default function PictureUploader() {

    const [picture, setPicture] = React.useState(false);
    const [src, setSrc] = React.useState(false);


    const handlePictureSelected = (event) => {
        var picture = event.target.files[0];
        var src = URL.createObjectURL(picture);

        setPicture(picture);
    }

    const renderPreview = () => {
        if (src) {
            return (
                <img src={src}/>
            );
        } else {
            return (
                <p>
                    No Preview
                </p>
            );
        }
    }

    const upload = () => {
        var formData = new FormData();

        formData.append("file", picture);

        $.ajax({
            url: "/some/api/endpoint",
            method: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                // Code to handle a succesful upload
            }
        });
    }

    return (
        <div>
            <h5>Picture Uploader</h5>

            <input
                type="file"
                onChange={handlePictureSelected}
            />
            <br/>
            <div>
                {renderPreview()}
            </div>
            <hr/>
            <button
                onClick={upload}
            >
                Upload
            </button>
        </div>
    );

}