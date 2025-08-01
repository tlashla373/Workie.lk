import { MoreHorizontal, MessageSquare, MapPin } from "lucide-react";
import pic_1 from '../../assets/pic_1.jpg';
import pic_2 from '../../assets/pic_2.jpg';
import pic_3 from '../../assets/pic_3.jpg';
import pic_4 from '../../assets/pic_4.jpg';
import img_1 from '../../assets/img_1.jpg';
import img_2 from '../../assets/img_2.jpg';
import img_3 from '../../assets/img_3.jpg';
import img_4 from '../../assets/img_4.jpg';

export default function MainFeed() {
  const categories = [
    { name: "Carpenter", icon: "👷", color: "bg-orange-100" },
    { name: "Mason", icon: "🧱", color: "bg-red-100" },
    { name: "Plumber", icon: "🔧", color: "bg-blue-100" },
    { name: "Welder", icon: "⚡", color: "bg-yellow-100" },
    { name: "Painter", icon: "🎨", color: "bg-green-100" }
  ];

  const posts = [
    {
      id: 1,
      author: "Jack Brown",
      profession: "Carpentor",
      location: "Colombo 07",
      avatar: pic_1,
      image: img_1,
      imageAlt: "Carpentry work"
    },
    {
      id: 2,
      author: "Sarah Wilson",
      profession: "Plumber",
      location: "Galle 08",
      avatar: pic_2,
      image: img_2,
      imageAlt: "Plumbing work"
    },
    {
      id: 3,
      author: "Mike Johnson",
      profession: "Painter",
      location: "Kandy 09",
      avatar: pic_3,
      image:img_3,
      imageAlt: "Painting work"
    },
    {
      id: 4,
      author: "David Lee",
      profession: "Welder",
      location: "Matara 10",
      avatar: pic_4,
      image: img_4,
      imageAlt: "Welding work"
    },
    {
      id: 5,
      author: "Anna Martinez",
      profession: "Mason",
      location: "Negombo 11",
      avatar:pic_1,
      image: img_1,
      imageAlt: "Masonry work"
    },
    {
      id: 6,
      author: "Tom Wilson",
      profession: "Electrician",
      location: "Jaffna 12",
      avatar: pic_2,
      image: img_2,
      imageAlt: "Electrical work"
    }
  ];

  const CategoryCard = ({ category, index }) => (
    
    <div
      key={index}
      className="flex flex-col bg-blue-50  items-center p-1 rounded-xl shadow-sm hover:shadow-md transition duration-200 cursor-pointer group"
    >
      <div className={`w-16 h-16 ${category.color}  rounded-xl flex items-center shadow-sm justify-center mb-1 group-hover:scale-110 transition duration-200`}>
        <span className="text-2xl">{category.icon}</span>
      </div>
      <span className="font-medium text-gray-700 ">{category.name}</span>
    </div>
  );

  const PostCard = ({ post }) => (
    <div className="bg-blue-50 rounded-xl overflow-hidden shadow-sm">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-bold text-gray-900">{post.author}</h3>
              <p className="text-gray-600">{post.profession} , {post.location}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative ">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 flex-1">
            <img
              src={pic_1}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              placeholder="Write your Feedback..."
              className="flex-1 bg-gray-100 border border-gray-400 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Category Section - Fixed */}
      <div className="bg-white rounded-xl p-6 mb-5 shadow-[-2px_1px_20px_-3px_rgba(0,_0,_0,_0.1)]">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Category</h2>
        <div className="grid grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>

      {/* Posts Feed - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar" style={{ maxHeight: 'calc(100vh - 350px)' }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}