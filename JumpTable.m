//
//  JumpTable.m
//  nativeWu
//
//  Created by Sean Purcell on 4/10/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "JumpTable.h"
#import <SDWebImage/UIImageView+WebCache.h>

@implementation JumpTable
{
    NSArray *artistTitles;
    NSDictionary* _dataBlob;
    bool _hasResized;
}


- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.delegate = self;
        self.dataSource = self;
    }
    return self;
}

- (void)setDataBlob:(NSDictionary*)blob{
    _dataBlob = blob;
    
    artistTitles = [[blob allKeys] sortedArrayUsingSelector:@selector(localizedCaseInsensitiveCompare:)];
    
    [self reloadData];
    
}

-(void)layoutSubviews{
    [super layoutSubviews];
    
    if(!_hasResized){
        _hasResized = true;
        CGRect jumpFrame = self.frame;
        self.frame = CGRectZero;
        self.frame = jumpFrame;
    }
}

- (NSArray *)sectionIndexTitlesForTableView:(UITableView *)tableView
{
    return artistTitles;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    NSString *sectionTitle = [artistTitles objectAtIndex:section];
    NSArray *sectionArtists = [_dataBlob objectForKey:sectionTitle];
    return [sectionArtists count];
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    return [artistTitles objectAtIndex:section];
}


- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return [artistTitles count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{

    static NSString *simpleTableIdentifier = @"SimpleTableCell";
    
    NSLog(@"WIDth of cell %f",[self rectForRowAtIndexPath:indexPath].size.width);
    NSLog(@"WIDth of self %f",self.frame.size.width);
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
    }
    
    
    NSString *sectionTitle = [artistTitles objectAtIndex:indexPath.section];
    NSArray *sectionArtists = [_dataBlob objectForKey:sectionTitle];
    NSDictionary *artist = [sectionArtists objectAtIndex:indexPath.row];
 
    // Here we use the new provided sd_setImageWithURL: method to load the web image
    [cell.imageView sd_setImageWithURL:[NSURL URLWithString:artist[@"imageUrl"]]
                      placeholderImage:[UIImage imageNamed:@"default-artist.png"]];
    
    cell.textLabel.text = (NSString*)artist[@"Artist"];
    
    return cell;
}


@end
