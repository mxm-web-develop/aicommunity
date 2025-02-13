'use client'

import { useState, useEffect } from 'react'

interface Contact {
  _id: string
  label: string
  name?: string
  email?: string
}

export default function ContactForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [organizations, setOrganizations] = useState<string[]>([])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '获取联系人列表失败')
      }
      
      setContacts(data)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '获取联系人列表失败')
    }
  }

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organization')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '获取组织列表失败')
      }
      
      setOrganizations(data.map((org: any) => org.name))
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '获取组织列表失败')
    }
  }

  useEffect(() => {
    fetchContacts()
    fetchOrganizations()
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const form = e.currentTarget
    const formData = new FormData(form)
    const contactData = {
      label: formData.get('label'),
      name: formData.get('name') || undefined,
      email: formData.get('email') || undefined
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '创建联系人失败')
      }
      
      form.reset()
      setSuccess(true)
      fetchContacts()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '创建联系人失败')
    }
  }

  const handleDelete = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '删除联系人失败')
      }
      
      fetchContacts()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '删除联系人失败')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">联系人管理</h1>
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          联系人创建成功！
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* 创建表单 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">创建新联系人</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标签 *
            </label>
            <input
              name="label"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入标签"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入姓名"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入邮箱"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="reset"
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              重置
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              提交
            </button>
          </div>
        </form>
      </div>

      {/* 联系人列表 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">联系人列表</h2>
        {contacts.length === 0 ? (
          <p className="text-gray-500">暂无联系人数据</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{contact.label}</h3>
                    {contact.name && <p className="text-gray-500 text-sm">姓名: {contact.name}</p>}
                    {contact.email && <p className="text-gray-500 text-sm">邮箱: {contact.email}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
