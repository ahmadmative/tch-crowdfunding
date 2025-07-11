import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loading from '../Loading';

// 🔑 Toolbar Config (without image, with alignment)
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ],
};

const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'blockquote', 'code-block',
    'link'
];

const PrivacyPolicy = () => {
    const [data, setData] = useState({
        _id: null as string | null,
        heading: 'Privacy Policy',
        type: 'privacy',
        content: 'Privacy Policy'
    });
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);

    const fetch = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/dynamic-page?type=${data.type}`);
            if (res.data.length > 0) {
                setEdit(true);
                setData(res.data[0]); // assuming it's an array and you need the first item
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!edit) {
                await axios.post(`${BASE_URL}/dynamic-page`, data);
                toast.success('Created successfully');
            } else {
                await axios.put(`${BASE_URL}/dynamic-page/${data._id}`, data);
                toast.success('Updated successfully');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    if(loading) return <div className="flex justify-center items-center min-h-screen"><Loading /></div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Heading
                </label>
                <input
                    type="text"
                    id="heading"
                    className="mt-1 p-2 border bg-transparent rounded w-full"
                    value={data.heading}
                    onChange={(e) => setData({ ...data, heading: e.target.value })}
                />

            </div>

            <ReactQuill
                value={data.content}
                onChange={(value) => setData({ ...data, content: value })}
                modules={modules}
                formats={formats}
                theme="snow"
            />

            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Saving...' : edit ? 'Update' : 'Create'}
            </button>
        </div>
    );
};

export default PrivacyPolicy;
