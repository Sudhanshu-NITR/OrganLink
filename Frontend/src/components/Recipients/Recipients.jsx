import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import RecipientCard from './RecipientCard.jsx';

const Recipient = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recipientList, setRecipientList] = useState([{
        name: 'Sarah Smith',
        age: 42,
        bloodGroup: 'A+',
        organType: 'Kidney',
        status: 'waiting',
        urgency: 'High'
      },
      {
        name: 'Mike Johnson',
        age: 28,
        bloodGroup: 'O-',
        organType: 'Kidney',
        status: 'waiting',
        urgency: 'Medium'
      }]);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/v1/hospitals/recipient/recipients');
                if(response.status) setRecipientList(response.data.data);
            } catch (error) {
                console.log('Recipient data fetching failed, ERROR: ', error);
            }
        })();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const results = recipients.filter(recipient =>
            recipient.name.toLowerCase().includes(query.toLowerCase()) ||
            recipient.bloodGroup.toLowerCase().includes(query.toLowerCase()) ||
            recipient.organType.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                type="text"
                placeholder="Search recipients by name, blood group, or organ type..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            
            <div className="mb-6">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <UserPlus className="w-5 h-5" />
                <span>Add Recipient</span>
                </button>
            </div>

            {searchQuery && searchResults.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                    <div className="space-y-4">
                        {searchResults.map((recipient, index) => (
                        <RecipientCard key={`search-${index}`} recipient={recipient} />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold mb-4">All Recipients</h2>
                <div className="space-y-4">
                    {
                        recipientList.map((recipient, index) => (
                            <RecipientCard key={index} recipient={recipient} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Recipient;