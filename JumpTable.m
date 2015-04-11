//
//  JumpTable.m
//  nativeWu
//
//  Created by Sean Purcell on 4/10/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "JumpTable.h"

@implementation JumpTable
{
    NSArray *artistTitles;
    NSDictionary* _dataBlob;
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
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
    }
    
    
    NSString *sectionTitle = [artistTitles objectAtIndex:indexPath.section];
    NSArray *sectionArtists = [_dataBlob objectForKey:sectionTitle];
    NSDictionary *artist = [sectionArtists objectAtIndex:indexPath.row];
 
    NSURL *imageURL = [NSURL URLWithString:artist[@"imageUrl"]];
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^{
        NSData *imageData = [NSData dataWithContentsOfURL:imageURL];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            cell.imageView.image = [UIImage imageWithData:imageData];
        });
    });
    
    cell.textLabel.text = (NSString*)artist[@"Artist"];
    
    return cell;
}


@end
