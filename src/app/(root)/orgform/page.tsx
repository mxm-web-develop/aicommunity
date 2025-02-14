'use client'

import { useState, useEffect } from 'react'

interface Organization {
  _id: string
  name: string
  description: string
}

export default function OrganizationForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organization')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '获取组织列表失败')
      }
      
      setOrganizations(data)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '获取组织列表失败')
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const form = e.currentTarget  // 保存表单引用
    const formData = new FormData(form)
    const name = formData.get('name')
    const description = formData.get('description')

    try {
      const response = await fetch('/api/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create organization')
      }
      
      form.reset()  // 使用保存的表单引用
      setSuccess(true)
      fetchOrganizations() // 创建成功后刷新列表
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    }
  }

  const handleDelete = async (orgId: string) => {
    try {
      const response = await fetch(`/api/organization?id=${orgId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '删除组织失败')
      }
      
      fetchOrganizations() // 删除成功后刷新列表
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '删除组织失败')
    }
  }

  return (
    <div className="container mx-auto p-6">
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          组织创建成功！
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
          {/* 组织列表 */}
          <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">组织列表</h2>
        {organizations.length === 0 ? (
          <p className="text-gray-500">暂无组织数据</p>
        ) : (
          <div className="space-y-4">
            {organizations.map((org) => (
              <div
                key={org._id}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{org.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">ID: {org._id}</p>
                    <p className="text-gray-600 mt-1">{org.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(org._id)}
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
      <h1 className="text-2xl font-bold mb-6">组织管理</h1>
      
      {/* 创建表单 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">创建新组织</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              组织名称
            </label>
            <input
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入组织名称"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              组织描述
            </label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="请输入组织描述"
              required
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

  
    </div>
  )
}
