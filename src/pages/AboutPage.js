import React from 'react'
// import {Link} from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout';

function AboutPage(props) {
    return (
        // <div className={'text-3xt'}>
        //     <div className={'flex'}>
        //     <Link to = {'/about'}>About Page입니당</Link>
        //     </div>
        //     <div>About Page</div>
        // </div>
        <BasicLayout>
            <div className={'text-2xl'}>
                About Page예요
            </div>
        </BasicLayout>
    )
}

export default AboutPage;