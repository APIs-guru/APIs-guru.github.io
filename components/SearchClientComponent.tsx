'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiCardModel } from '@/models/ApiCardModel';
import Card from '@/components/Card';
import { Input } from '@/components/ui/input';
import { fetchApis, createApiCardModel } from '@/services/api';
import { ApiList } from '@/models/ApiCardModel';

interface SearchClientComponentProps {
  repoStarCounts: Record<string, number>;
}

function SearchClientComponentInner({ repoStarCounts }: SearchClientComponentProps) {
  const searchParams = useSearchParams();
  
  const initialSearchTerm = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filteredCards, setFilteredCards] = useState<ApiCardModel[]>([]);
  const [allApiCards, setAllApiCards] = useState<ApiCardModel[]>([]);
  const [copyText, setCopyText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiMetrics, setApiMetrics] = useState({ numAPIs: 0, numEndpoints: 0 });

  // Clean description function to remove markdown symbols
  const cleanDescription = (description: string): string => {
    if (!description) return '';
    
    return description
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/>\s/g, '') // Remove blockquotes
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .trim();
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch APIs
        const apiList: ApiList = await fetchApis();
        
        // Fetch metrics
        const apiMetricsResponse = await fetch("https://api.apis.guru/v2/metrics.json");
        const metrics = await apiMetricsResponse.json();
        setApiMetrics(metrics);
        
        // Create API cards with cleaned descriptions
        const apiCards: ApiCardModel[] = Object.entries(apiList).map(([name, api]) => {
          const card = createApiCardModel(name, api);
          // Clean the description
          if (card.cardDescription) {
            card.cardDescription = cleanDescription(card.cardDescription);
          }
          if (card.markedDescription) {
            card.markedDescription = cleanDescription(card.markedDescription);
          }
          return card;
        });
        
        setAllApiCards(apiCards);
        setFilteredCards(filterCards(initialSearchTerm, apiCards));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const filterCards = (term: string, cards: ApiCardModel[] = allApiCards) => {
    if (term === '') {
      return cards;
    }

    return cards.filter(
      (card) =>
        card.name.toLowerCase().includes(term.toLowerCase()) ||
        card.cardDescription?.toLowerCase().includes(term.toLowerCase()) ||
        card.categories?.some((category) => category.toLowerCase().includes(term.toLowerCase())) ||
        card.tags?.some((tag) => tag.toLowerCase().includes(term.toLowerCase()))
    );
  };

  
  const updateQueryParam = (term: string) => {
    
    const params = new URLSearchParams(searchParams.toString());
    
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    
    
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    
    
    window.history.pushState({}, '', newUrl);
    
    
    setCopyText(`${window.location.origin}${newUrl}`);
  };

  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredCards(filterCards(value));
    updateQueryParam(value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  
  useEffect(() => {
    
    Object.entries(repoStarCounts).forEach(([name, stars]) => {
      const elements = document.querySelectorAll(`[data-proj="${name}"].stars-count`);
      elements.forEach((el) => {
        if (el) el.textContent = stars.toString();
      });
    });
  }, [repoStarCounts]);
  
  
  useEffect(() => {
    const term = searchParams.get('q') || '';
    setSearchTerm(term);
    setFilteredCards(filterCards(term));
    
    const params = new URLSearchParams(searchParams.toString());
    const url = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    setCopyText(`${window.location.origin}${url}`);
  }, [searchParams, allApiCards]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="animate-pulse">Loading APIs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4  relative">
      <div className="relative z-10">
        {/* Search section */}
        <div id="search" className="mb-6 max-w-2xl mx-auto">
          <div className="mb-2 flex justify-between items-center">
            <label htmlFor="search-input" className="text-lg font-medium text-gray-700">
              Filter {apiMetrics.numAPIs.toLocaleString()} APIs&nbsp;
              <button 
                id="btnCopy" 
                onClick={copyToClipboard}
                className={`inline-flex items-center ${searchTerm ? '' : 'hidden'}`}
                title="Copy search link to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-gray-600">
                  <title>Copy search link to clipboard</title>
                  <path d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"></path>
                </svg>
                {isCopied && <span className="ml-1 text-sm text-green-600">Copied!</span>}
              </button>
            </label>
          </div>
          <Input
            id="search-input"
            type="search"
            placeholder="Search…"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
            required
          />
        </div>

        {/* API cards section */}
        <section id="apis-list" className="cards">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <Card key={`${card.name}-${index}`} model={card} />
              ))
            ) : (
              <div className="col-span-full text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                No APIs found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SearchClientComponent({ repoStarCounts }: SearchClientComponentProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SearchClientComponentInner repoStarCounts={repoStarCounts} />
    </Suspense>
  );
}