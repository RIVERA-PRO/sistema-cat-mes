import React from 'react';
import './Developer.css';
import { Link as Anchor } from 'react-router-dom';
export default function Developer() {


    return (
        <p className='Developer'>
            © Copyright 2024<Anchor to={`https://www.stechdev.com`} > www.stechdev.com
            </Anchor>
        </p>
    );
}
