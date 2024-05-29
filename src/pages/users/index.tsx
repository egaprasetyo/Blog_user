import React, { SyntheticEvent, useEffect, useState } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { GoTrash } from "react-icons/go";
import { PiUserCirclePlusLight } from "react-icons/pi";
import { IoWarningOutline } from "react-icons/io5";
import { gorestApi } from '@/lib/api';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import dynamic from "next/dynamic";
const LayoutComponent = dynamic(() => import("@/components/layout"));

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm] = useDebounce(searchQuery, 1000);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (page: number, perPage: number, searchTerm: string) => {
    setIsLoading(true)
    try {
      const res = await gorestApi.get(`/users?page=${page}&per_page=${perPage}&name=${searchTerm}`);
      setUsers(res.data);
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, perPage, searchTerm);
  }, [currentPage, perPage, searchTerm]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <LayoutComponent
      metaTitle="User - User management"
      metaDescription="This is user management page"
    >
      <div className='py-10 min-h-screen'>
        <div className='flex flex-col item-start md:flex-row justify-between md:items-center gap-6'>
          <h3 className='text-2xl font-semibold'>User Management</h3>
          <AddUser />
        </div>
        <div className="overflow-auto rounded-lg border border-gray-200 shadow-md mt-3">
          <div className="flex flex-col gap-4 md:flex-row justify-between p-6">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 w-full md:w-1/3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <table className="w-full bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50 sticky top-0 z-10 flex w-full">
              <tr className='flex w-full'>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 w-1/4">Name</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 w-1/4">Gender</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 w-1/4">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900 w-1/4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100 flex flex-col items-center justify-between overflow-y-scroll no-scrollbar w-full h-[60vh]">
              {
                isLoading ? (
                  <tr className='flex justify-center items-center w-full'>
                    <td colSpan={4} className="px-6 py-4 flex justify-center items-center w-full font-medium text-gray-500 text-center">Loading...</td>
                  </tr>
                ) : (
                  users.length > 0 ? (
                    users.map(({ id, name, email, gender, status }) => (
                      <tr key={id} className="hover:bg-gray-50 flex w-full">
                        <th className="flex w-1/4 gap-3 px-6 py-4 font-normal text-gray-900">
                          <div>
                            <div className="font-medium text-base text-gray-700">{name}</div>
                            <div className="text-gray-400 text-xs">{email}</div>
                          </div>
                        </th>
                        <td className="px-6 py-4 w-1/4">
                          {gender}
                        </td>
                        <td className="px-6 py-4 w-1/4">
                          {
                            status === 'active' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                Inactive
                              </span>
                            )
                          }
                        </td>
                        <td className="px-6 py-4 w-1/4">
                          <div className="flex justify-center">
                            <DeleteUser {...{ id, name, email, gender, status }} />
                            <EditUser {...{ id, name, email, gender, status }} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="hover:bg-gray-50 flex items-center w-full">
                      <th colSpan={4} className="flex justify-center items-center w-full text-center px-6 py-4 font-normal text-gray-500">
                        No Data Found
                      </th>
                    </tr>
                  )

                )
              }
            </tbody>
          </table>
        </div>
        <div className="my-4 flex justify-between">
          <div className='flex justify-center'>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 mx-1 border border-gray-300 rounded-md bg-blue-500 hover:bg-blue-400 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1 border border-gray-300 rounded-md bg-white text-gray-700">
              {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 mx-1 border border-gray-300 rounded-md bg-blue-500 hover:bg-blue-400 text-white disabled:opacity-50"
              disabled={isLoading || users.length === 0 || users.length === 1}
            >
              Next
            </button>

          </div>
          <select
            id="perpage"
            name="perpage"
            className="px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={perPage}
            disabled={isLoading || users.length === 0 || users.length === 1}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

    </LayoutComponent>
  )
}

const AddUser = () => {
  const router = useRouter();

  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState({
    name: '',
    email: '',
    gender: '',
    status: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    gender: '',
    status: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      gorestApi.post('/users', data)
        .then((response) => {
          setData({
            name: '',
            email: '',
            gender: '',
            status: ''
          });
          setErrors({
            name: '',
            email: '',
            gender: '',
            status: ''
          })
          router.refresh();
          setModal(false);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to add user:', error);
          setIsLoading(false);
        })
    }
  };

  const closeModal = () => {
    setData({
      name: '',
      email: '',
      gender: '',
      status: ''
    });
    setErrors({
      name: '',
      email: '',
      gender: '',
      status: ''
    })
    setModal(false);
  };

  const validateForm = () => {
    let isValid: boolean = true;

    const newErrors = { ...errors };

    if (data.name.trim() === '') {
      newErrors.name = 'Please input name.';
      isValid = false;
    } else {
      newErrors.name = '';
    }

    if (data.email.trim() === '') {
      newErrors.email = 'Please input email.';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (data.gender.trim() === '') {
      newErrors.gender = 'Please select gender.';
      isValid = false;
    } else {
      newErrors.gender = '';
    }

    if (data.status.trim() === '') {
      newErrors.status = 'Please select status.';
      isValid = false;
    } else {
      newErrors.status = '';
    }

    setErrors(newErrors);
    return isValid;
  }

  return (
    <>
      <button onClick={() => setModal(true)} className="text-sm bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md">
        <PiUserCirclePlusLight className="w-6 h-6 inline-block mr-2" /> Add User
      </button>

      <Modal visible={modal} onClose={() => closeModal()} allowClickOutside={false}>
        <div className="mx-auto mb-4">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Add User</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-slate-600 mb-2">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={data.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-xs italic text-red-500 mt-1">{errors.name}</p>}

            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-slate-600 mb-2">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={data.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-xs italic text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="gender" className="block text-slate-600 mb-2">Gender:</label>
              <select
                id="gender"
                name="gender"
                className="block w-full py-3 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={data.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
              {errors.gender && <p className="text-xs italic text-red-500 mt-1">{errors.gender}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="gender" className="block text-slate-600 mb-2">Status:</label>

              <label className="inline-flex items-center gap-1 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600 cursor-pointer mr-3">
                <input
                  type="radio"
                  name="status"
                  className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                  value="active"
                  checked={data.status === 'active'}
                  onChange={handleInputChange}
                />
                Active
              </label>

              <label className="inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                  checked={data.status === 'inactive'}
                  value="inactive"
                  onChange={handleInputChange}
                />
                Inactive
              </label>
              {errors.status && <p className="text-xs italic text-red-500 mt-1">{errors.status}</p>}
            </div>
            <hr className="border-t-solid border-1 border-grey mt-8" />
            <div className="flex flex-row justify-center md:justify-end gap-4">
              <button
                className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 hover:bg-slate-300 text-blue-500 hover:text-white"
                onClick={() => closeModal()}
                type='button'
                disabled={isLoading}
              >
                Close
              </button>
              {
                isLoading ? (
                  <button
                    className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-blue-500 hover:bg-blue-600 text-white"
                    type='button'
                    disabled
                  >
                    Saving...
                  </button>
                ) : (
                  <button
                    className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-blue-500 hover:bg-blue-600 text-white"
                    type='submit'
                  >
                    Submit
                  </button>
                )
              }

            </div>
          </form>

        </div>
      </Modal>
    </>
  )

}

const EditUser = ({ id, name, email, status }: User) => {
  const router = useRouter();

  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState({
    name: name,
    email: email,
    status: status
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    status: ''
  })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEdit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      gorestApi.put(`/users/${id}`, data)
        .then((response) => {
          setIsLoading(false);
          router.refresh();
          setModal(false);
        })
        .catch((error) => {
          console.error('Failed to add user:', error);
          setIsLoading(false);
        })
    }
  };

  const closeModal = () => {
    setData({
      name: name,
      email: email,
      status: status
    });
    setErrors({
      name: '',
      email: '',
      status: ''
    })
    setModal(false);
  };

  const validateForm = () => {
    let isValid: boolean = true;

    const newErrors = { ...errors };

    if (data.name.trim() === '') {
      newErrors.name = 'Please input name.';
      isValid = false;
    } else {
      newErrors.name = '';
    }

    if (data.email.trim() === '') {
      newErrors.email = 'Please input email.';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (data.status.trim() === '') {
      newErrors.status = 'Please select status.';
      isValid = false;
    } else {
      newErrors.status = '';
    }

    setErrors(newErrors);
    return isValid;
  }

  return (
    <>
      <button onClick={() => setModal(true)} className='hover:bg-slate-200/60 py-2 px-2 rounded transition-all duration-300'>
        <BiSolidEdit className='h-6 w-6' />
      </button>

      <Modal visible={modal} onClose={() => closeModal()} allowClickOutside={false}>
        <div className="mx-auto mb-4">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Edit User</h2>

          <form onSubmit={handleEdit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-slate-600 mb-2">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={data.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-xs italic text-red-500 mt-1">{errors.name}</p>}

            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-slate-600 mb-2">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                value={data.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-xs italic text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="gender" className="block text-slate-600 mb-2">Status:</label>

              <label className="inline-flex items-center gap-1 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600 cursor-pointer mr-3">
                <input
                  type="radio"
                  name="status"
                  className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                  value="active"
                  checked={data.status === 'active'}
                  onChange={handleInputChange}
                />
                Active
              </label>

              <label className="inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                  checked={data.status === 'inactive'}
                  value="inactive"
                  onChange={handleInputChange}
                />
                Inactive
              </label>
              {errors.status && <p className="text-xs italic text-red-500 mt-1">{errors.status}</p>}
            </div>
            <hr className="border-t-solid border-1 border-grey mt-8" />
            <div className="flex flex-row justify-center md:justify-end gap-4">
              <button
                className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 hover:bg-slate-300 text-blue-500 hover:text-white"
                onClick={() => closeModal()}
                type='button'
                disabled={isLoading}
              >
                Close
              </button>
              {
                isLoading ? (
                  <button
                    className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-blue-500 hover:bg-blue-600 text-white"
                    type='button'
                    disabled
                  >
                    Saving...
                  </button>
                ) : (
                  <button
                    className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-blue-500 hover:bg-blue-600 text-white"
                    type='submit'
                  >
                    Submit
                  </button>
                )
              }

            </div>
          </form>

        </div>
      </Modal>
    </>
  )
}

const DeleteUser = ({ id, name }: User) => {
  const router = useRouter();

  const [modal, setModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const closeModal = () => {
    setModal(false);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    gorestApi.delete(`/users/${id}`)
      .then((response) => {
        router.refresh();
        setModal(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to delete user:', error);
        setIsLoading(false);
      })
  };

  return (
    <>
      <button onClick={() => setModal(true)} className='hover:bg-red-500 hover:text-white py-2 px-2 rounded transition-all duration-300'>
        <GoTrash className='h-6 w-6' />
      </button>

      <Modal visible={modal} onClose={() => closeModal()} allowClickOutside={false}>
        <div className="mx-auto mb-4">

          <div className='text-center'>
            <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
              <IoWarningOutline className='w-8 h-8' />
            </span>

            <h3 className="mb-2 text-2xl font-bold text-gray-800">
              Delete user
            </h3>
            <p className="text-gray-500">
              Are you sure you want to delete <span className='font-semibold'>{name}</span>?
            </p>
          </div>

          <hr className="border-t-solid border-1 border-grey mt-8" />
          <div className="flex flex-row justify-center gap-4">
            <button
              className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 hover:bg-slate-300 text-blue-500 hover:text-white"
              onClick={() => closeModal()}
              type='button'
              disabled={isLoading}
            >
              Close
            </button>
            {
              isLoading ? (
                <button
                  className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-red-500 hover:bg-red-600 text-white"
                  type='button'
                  disabled
                >
                  Deleting...
                </button>
              ) : (
                <button
                  className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-red-500 hover:bg-red-600 text-white"
                  type='submit'
                  onClick={() => handleDelete(id)}
                >
                  Delete
                </button>
              )
            }

          </div>

        </div>
      </Modal>
    </>
  )
}

export default Users