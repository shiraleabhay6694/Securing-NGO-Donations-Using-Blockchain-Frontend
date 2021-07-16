pragma solidity ^0.4.17;

contract NGOList{
    mapping(address=>address) list;
    address[] NGOAddresses;
    function createNewNGO(string ngoName) public{
        require(list[msg.sender] == 0x0000000000000000000000000000000000000000);
        address newNGO = new NGO(msg.sender,ngoName);
        list[msg.sender] = newNGO;
        NGOAddresses.push(newNGO);
    }
    function getNGO() public view returns (address){
        return list[msg.sender];
    }
    function getNGOList() public view returns(address[]){
        return NGOAddresses;
    }
    function getNGOByAddress(address owner) public view returns(address){
        return list[owner];
    } 
}

contract NGO{
    struct TransactionByNGO{
        string description;
        string recipientName;
        string recipientAddress;
        uint amount;
        address recipient;
        uint createdAt;
    }
    struct Donar{
        address dAddress;
        string email;
        uint value;
        uint valueUsed;
        uint valRemaining;
        uint valLastUsed;
        uint createdAt; 
    }
    uint public lastIndex;
    uint public startIndex;
    address public manager;
    string public ngoName;
    Donar[] public donorsList;
    uint public donorsCount;
    TransactionByNGO[] public transactionByNGOList;
    function NGO(address creator,string name) public{
        manager = creator;
        ngoName = name;
        startIndex = 0;
        lastIndex = 0;
    }
    function contribute(string mail) public payable {
        require(msg.value>0);
        Donar memory donation = Donar({
            email : mail,
            dAddress:msg.sender,
            value:msg.value,
            valueUsed:0,
            valRemaining:msg.value,
            valLastUsed:0,
            createdAt:block.timestamp
        });
        donorsList.push(donation);
        donorsCount++;
    }
    function sendMoneyRecord() public view returns(uint,uint){
        return (startIndex,lastIndex);
    }
    function sendMoneyByNGO(string desc, string name, string recAddress, uint val, address rec ) public payable {
        require(msg.sender == manager);
        require(val<=address(this).balance);
        TransactionByNGO memory newTransaction =  TransactionByNGO({
            description : desc,
            recipientName : name,
            recipientAddress : recAddress,
            amount : val,
            recipient : rec,
            createdAt:block.timestamp
        });
        newTransaction.recipient.transfer(val);
        transactionByNGOList.push(newTransaction);
        uint amount = val;
        uint i;
        startIndex = lastIndex;
        for(i = lastIndex; i<donorsList.length; i++){
            if(amount>donorsList[i].valRemaining){
                amount = amount-donorsList[i].valRemaining;
                donorsList[i].valueUsed += donorsList[i].valRemaining;
                donorsList[i].valLastUsed = donorsList[i].valRemaining;
                donorsList[i].valRemaining = 0;
            }else if(amount==donorsList[i].valRemaining){
                donorsList[i].valueUsed += donorsList[i].valRemaining;
                donorsList[i].valLastUsed = donorsList[i].valRemaining;
                donorsList[i].valRemaining = 0;
                lastIndex = i+1;
                break;
            }
            else{
                donorsList[i].valRemaining -= amount;
                donorsList[i].valueUsed += amount;
                donorsList[i].valLastUsed = amount;
                lastIndex = i;
                break;
            }
        }
    }
    function getDetails() public view returns(uint,uint,uint){
        return (donorsCount,transactionByNGOList.length,address(this).balance);
    }
}

