import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {


    return (
        <div>
            <p className="f3">
                {'This Magic Eye will detect faces in your pictures. Give it a try'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input 
                        className="f4 pa2 w-70 center" 
                        type="text" 
                        onChange = {onInputChange}
                    />
                    <button 
                        className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
                        onClick={onButtonSubmit}
                        >Detect</button>
                </div>
            </div>
            <p className="f4">
                {'Give it a try with this link or paste your own: https://bit.ly/3oD4Kg5'}
            </p>
        </div>
    );
}

export default ImageLinkForm;
