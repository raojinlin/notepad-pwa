import React from "react";
import Preview from '../../components/Share/Preview'


export default function SharePage({ params, searchParams }) {
    const sid = params.slug;
    return (
        <Preview sid={sid} password={searchParams?.password} />
    )
}