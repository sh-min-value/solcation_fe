import React from 'react';
import { AiFillSchedule, AiFillShopping, AiFillCar } from "react-icons/ai";
import { FaCheckCircle, FaTree, FaBriefcaseMedical  } from "react-icons/fa";
import { BiSolidPlaneAlt, BiSolidBus, BiSolidBowlRice, BiSolidCoffee, BiSolidStore, BiSolidDrink, BiSolidShoppingBag, BiSolidBed, BiDotsHorizontalRounded } from "react-icons/bi";
import { MdKitesurfing, MdFestival} from "react-icons/md";
import { HiLibrary } from "react-icons/hi";
import { BsFillPiggyBankFill } from 'react-icons/bs';

// 그룹 카테고리 아이콘 import
import FamilyIcon from '../assets/categoryIcons/family.svg';
import FriendIcon from '../assets/categoryIcons/friend.svg';
import LoveIcon from '../assets/categoryIcons/love.svg';
import PeerIcon from '../assets/categoryIcons/peer.svg';

// state 값에 따른 아이콘 반환
export const getStateIcon = (state, className = "w-3 h-3 text-gray-500 mr-1") => {
    switch (state) {
        case 'BEFORE':
            return <><AiFillSchedule className={className} /><p>여행 전</p></>;
        case 'ONGOING':
            return <><BiSolidPlaneAlt className={className} /><p>여행 중</p></>;
        case 'FINISH':
            return <><FaCheckCircle className={className} /><p>여행 완료</p></>;
        default:
            return <><AiFillSchedule className={className} /><p>여행 전</p></>;
    }
};

// 카테고리 아이콘 반환
export const getTravelCategoryIcon = (categoryId, className = "w-3 h-3 text-gray-500 mr-1") => {
    switch (categoryId) {
        case 1:
            return <><BiSolidBowlRice className={className} /><p>음식, 미식</p></>;
        case 2:
            return <><MdKitesurfing className={className} /><p>레저, 액티비티</p></>;
        case 3:
            return <><FaTree className={className} /><p>휴양, 힐링</p></>;
        case 4:
            return <><HiLibrary className={className} /><p>문화, 역사</p></>;
        case 5:
            return <><AiFillShopping className={className} /><p>쇼핑, SNS 핫플레이스</p></>;
        case 6:
            return <><MdFestival className={className} /><p>시즌 축제</p></>;
        case 7:
            return <><BiSolidBus className={className} /><p>관광</p></>;
        default:
            return <><BiDotsHorizontalRounded className={className} /><p>기타</p></>;
    }
};

export const getTransactionCategoryIcon = (categoryId, className = "w-3 h-3 text-gray-500 mr-1") => {
    switch (categoryId) {
        case 1:
            return <><BiSolidBowlRice className={className} /><p>식비</p></>;
        case 2:
            return <><BiSolidCoffee className={className} /><p>카페, 간식</p></>;
        case 3:
            return <><BiSolidStore className={className} /><p>편의점, 마트</p></>;
        case 4:
            return <><BiSolidDrink className={className} /><p>술, 유흥</p></>;
        case 5:
            return <><BiSolidShoppingBag className={className} /><p>쇼핑</p></>;
        case 6:
            return <><FaBriefcaseMedical className={className} /><p>의료</p></>;
        case 7:
            return <><BiSolidBed className={className} /><p>숙박</p></>;
        case 8:
            return <><AiFillCar className={className} /><p>교통</p></>;
        case 9:
            return <><BsFillPiggyBankFill className={className} /><p>이체</p></>;
        default:
            return <><BiDotsHorizontalRounded className={className} /><p>기타</p></>;
    }
};

// 그룹 카테고리 아이콘 반환
export const getGroupCategoryIcon = (categoryCode) => {
    switch (categoryCode) {
        case 'FAMILY':
            return FamilyIcon;
        case 'FRIEND':
            return FriendIcon;
        case 'LOVE':
            return LoveIcon;
        case 'PEER':
            return PeerIcon;
        default:
            return FriendIcon; // 기본값
    }
};

// 그룹 카테고리 이름 반환
export const getGroupCategoryName = (categoryCode) => {
    switch (categoryCode) {
        case 'FAMILY':
            return '가족';
        case 'FRIEND':
            return '친구';
        case 'LOVE':
            return '연인';
        case 'PEER':
            return '동료';
        default:
            return '친구';
    }
};